// src/pages/CustomerOrders.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import {
  isCustomerAuthenticated,
  getCustomerToken,
  customerLogout,
} from "../utils/auth";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [receiptFilter, setReceiptFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    if (!isCustomerAuthenticated()) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        const sortedOrders = (data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sortedOrders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = getCustomerToken();
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        fetchOrders();
      } else {
        setError(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      setError("Network error. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending_payment: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
      processing: "bg-blue-900/30 text-blue-300 border-blue-500/30",
      confirmed: "bg-green-900/30 text-green-300 border-green-500/30",
      shipped: "bg-purple-900/30 text-purple-300 border-purple-500/30",
      delivered: "bg-emerald-900/30 text-emerald-300 border-emerald-500/30",
      cancelled: "bg-red-900/30 text-red-300 border-red-500/30",
    };
    return badges[status] || "bg-gray-800 text-gray-300 border-gray-600";
  };

  const getReceiptStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
      verified: "bg-green-900/30 text-green-300 border-green-500/30",
      rejected: "bg-red-900/30 text-red-300 border-red-500/30",
    };
    return badges[status] || "bg-gray-800 text-gray-300 border-gray-600";
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "Contact for Price";
    return `LKR ${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderTimeline = (order) => {
    const steps = [
      {
        id: "payment",
        name: "Payment Submitted",
        shortName: "Payment",
        status: order.receiptStatus,
        completed: order.receiptStatus === "verified",
        active:
          order.receiptStatus === "pending" ||
          order.receiptStatus === "rejected",
        icon: "💳",
        description:
          order.receiptStatus === "verified"
            ? "Payment verified"
            : order.receiptStatus === "pending"
              ? "Awaiting verification"
              : "Please resubmit",
      },
      {
        id: "confirmed",
        name: "Order Confirmed",
        shortName: "Confirmed",
        status: order.status,
        completed: ["confirmed", "shipped", "delivered"].includes(order.status),
        active: order.status === "processing",
        icon: "✓",
        description: ["confirmed", "shipped", "delivered"].includes(
          order.status,
        )
          ? "Order confirmed"
          : "Processing order",
      },
      {
        id: "shipped",
        name: "Shipped",
        shortName: "Shipped",
        status: order.status,
        completed: ["shipped", "delivered"].includes(order.status),
        active: order.status === "confirmed",
        icon: "🚚",
        description: ["shipped", "delivered"].includes(order.status)
          ? "Order shipped"
          : "Preparing shipment",
      },
      {
        id: "delivered",
        name: "Delivered",
        shortName: "Delivered",
        status: order.status,
        completed: order.status === "delivered",
        active: order.status === "shipped",
        icon: "📦",
        description:
          order.status === "delivered" ? "Order delivered" : "In transit",
      },
    ];

    if (order.status === "cancelled") {
      return steps.map((step) => ({
        ...step,
        completed: false,
        active: false,
        cancelled: true,
      }));
    }

    return steps;
  };

  const getDeliveryProgress = (order) => {
    if (order.status === "cancelled") return 0;
    const statusOrder = [
      "pending_payment",
      "processing",
      "confirmed",
      "shipped",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const receiptMatch =
      receiptFilter === "all" ||
      (receiptFilter === "verified" && order.receiptStatus === "verified") ||
      (receiptFilter === "not_verified" && order.receiptStatus !== "verified");
    return statusMatch && receiptMatch;
  });

  const hasAdminNotesAndActive = (order) => {
    return (
      order.adminNotes &&
      order.status !== "delivered" &&
      order.status !== "cancelled"
    );
  };

  if (loading) {
    return <Loading message="Loading your orders..." size="large" />;
  }

  return (
    <div className="bg-black text-white min-h-screen">

      <Helmet>
        <title>My Orders – Happy Time</title>
        <meta name="description" content="View and track your orders from Happy Time. Check order status, payment verification, and delivery progress." />
        <meta name="robots" content="noindex, nofollow" /> {/* private page */}
        <link rel="canonical" href="https://yourdomain.com/orders" />

        {/* Open Graph */}
        <meta property="og:title" content="My Orders – Happy Time" />
        <meta property="og:description" content="View and track your orders from Happy Time." />
        <meta property="og:url" content="https://yourdomain.com/orders" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourdomain.com/images/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My Orders – Happy Time" />
        <meta name="twitter:description" content="View and track your orders from Happy Time." />
        <meta name="twitter:image" content="https://yourdomain.com/images/og-image.jpg" />
      </Helmet>


      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col items-start sm:items-center sm:flex-row justify-between gap-3 mb-5">
          <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
          <Link
            to="/shop"
            className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm transition text-center whitespace-nowrap"
          >
            Continue Shopping
          </Link>
        </div>

        {/* FILTERS - Stacked on mobile */}
        <div className="mb-5 space-y-4">
          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">
              Order Status
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "All" },
                { value: "pending_payment", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "confirmed", label: "Confirmed" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    statusFilter === filter.value
                      ? "bg-gold text-black shadow-gold/20"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">
              Receipt Status
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "All" },
                { value: "verified", label: "Verified" },
                { value: "not_verified", label: "Not Verified" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setReceiptFilter(filter.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    receiptFilter === filter.value
                      ? "bg-gold text-black shadow-gold/20"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gold"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="text-center bg-gray-900/60 rounded-xl p-6 sm:p-8 border border-gray-800">
            <div className="text-4xl sm:text-5xl mb-3">📦</div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              No Orders Found
            </h2>
            <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
              No orders match your current filters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setReceiptFilter("all");
                }}
                className="bg-gold text-black px-4 py-1.5 rounded font-medium text-sm hover:bg-gold/90 transition"
              >
                Clear Filters
              </button>
              <Link
                to="/shop"
                className="bg-gray-800 text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-gray-700 transition text-center"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW MODE TOGGLE - Right-aligned */}
            <div className="flex justify-end mb-4">
              <div className="flex bg-gray-800 rounded-lg p-0.5 text-[13px]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1 rounded transition ${viewMode === "grid" ? "bg-gold text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-1 rounded transition ${viewMode === "list" ? "bg-gold text-black" : "text-gray-400 hover:text-white"}`}
                >
                  List
                </button>
              </div>
            </div>

            {/* ORDERS GRID/LIST */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-gray-900/60 border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-gold/10 ${
                    hasAdminNotesAndActive(order)
                      ? "border-red-500/50"
                      : "border-gray-800 hover:border-gold/50"
                  }`}
                >
                  {/* Order Header */}
                  <div className="p-3 border-b border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white truncate">
                          #
                          {order._id
                            .substring(order._id.length - 6)
                            .toUpperCase()}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`px-1.5 py-0.5 rounded border text-[9px] font-medium ${getStatusBadge(order.status)}`}
                        >
                          {order.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border text-[9px] font-medium ${getReceiptStatusBadge(order.receiptStatus)}`}
                        >
                          {order.receiptStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {hasAdminNotesAndActive(order) && (
                      <div className="mt-2 p-1.5 bg-red-900/20 border border-red-800 rounded">
                        <p className="text-red-300 text-[11px] font-medium flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-2.5 w-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Action required
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-3 border-b border-gray-800">
                    <div className="flex gap-2 mb-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="w-12 h-12 flex-shrink-0">
                          {item.productId?.images?.[0] ? (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="w-full h-full object-cover rounded border border-gray-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center text-gray-600 text-[10px] border border-gray-700">
                              ?
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-gold text-[10px] font-medium border border-gray-700">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-xs">Total:</span>
                      <span className="font-bold text-gold text-sm">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>

                    <div className="text-center pt-2 border-t border-gray-800">
                      <span className="text-gold text-[11px] font-medium flex items-center justify-center gap-1">
                        View details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden relative shadow-2xl shadow-gold/10">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gold text-xl font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-all z-20"
              aria-label="Close order details"
            >
              ✕
            </button>

            <div className="overflow-y-auto max-h-[95vh]">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 border-b border-gray-700">
                <div className="text-center">
                  <div className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 bg-gold/10 border border-gold/30 rounded-full mb-2">
                    <span className="text-gold text-xs sm:text-sm font-semibold">
                      ORDER DETAILS
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Order #
                    {selectedOrder._id
                      .substring(selectedOrder._id.length - 8)
                      .toUpperCase()}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                  {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                    <p className="text-gray-500 text-[11px] sm:text-xs">
                      Last updated: {formatDate(selectedOrder.updatedAt)}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusBadge(selectedOrder.status)}`}
                    >
                      {selectedOrder.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getReceiptStatusBadge(selectedOrder.receiptStatus)}`}
                    >
                      RECEIPT: {selectedOrder.receiptStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Delivery Progress */}
                <div className="mb-6 sm:mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                  <h3 className="font-bold text-lg sm:text-xl mb-4 text-center text-gold">
                    Delivery Progress
                  </h3>

                  <div className="relative mb-6">
                    <div className="relative h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-1000 ease-out rounded-full"
                        style={{
                          width: `${getDeliveryProgress(selectedOrder)}%`,
                        }}
                      ></div>
                    </div>

                    {selectedOrder.status !== "cancelled" && (
                      <div
                        className="absolute -top-5 left-0 transition-all duration-1000 ease-out transform -translate-x-1/2"
                        style={{
                          left: `${getDeliveryProgress(selectedOrder)}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="text-2xl sm:text-3xl animate-bounce">
                          <img
                            src="/Delivery_Truck.webp"
                            alt="truck icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            loading="eager"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {getOrderTimeline(selectedOrder).map((step, index) => {
                      const isCancelled = selectedOrder.status === "cancelled";
                      let containerClass =
                        "text-center transition-all duration-300 ";
                      let iconClass =
                        "w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-1 border-2 transition-all ";

                      if (isCancelled) {
                        containerClass += "opacity-50";
                        iconClass +=
                          "bg-red-500/10 text-red-400 border-red-500/30";
                      } else if (step.completed) {
                        containerClass += "scale-100";
                        iconClass +=
                          "bg-green-500/20 text-green-400 border-green-500 shadow-green-500/20";
                      } else if (step.active) {
                        containerClass += "scale-105";
                        iconClass +=
                          "bg-gold/20 text-gold border-gold shadow-gold/30 animate-pulse";
                      } else {
                        containerClass += "opacity-60";
                        iconClass +=
                          "bg-gray-700/50 text-gray-500 border-gray-600";
                      }

                      return (
                        <div key={step.id} className={containerClass}>
                          <div className={iconClass}>
                            {isCancelled
                              ? "✕"
                              : step.completed
                                ? "✓"
                                : step.icon}
                          </div>
                          <div className="text-[10px] sm:text-xs font-semibold text-white">
                            {step.shortName}
                          </div>
                          <div className="text-[8px] sm:text-[10px] text-gray-400">
                            {isCancelled ? "Cancelled" : step.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedOrder.adminNotes && (
                  <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/50 rounded-xl">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="text-lg sm:text-xl">⚠️</div>
                      <div>
                        <h4 className="font-bold text-red-300 text-sm sm:text-base mb-1">
                          Message from Admin
                        </h4>
                        <p className="text-red-200 text-[13px] sm:text-sm leading-relaxed">
                          {selectedOrder.adminNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span>📦</span> Order Items
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700"
                      >
                        {item.productId?.images?.[0] && (
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="w-full h-full object-cover rounded-lg border-2 border-gray-700"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base mb-0.5">
                            {item.productId?.title}
                          </h4>
                          <p className="text-gold text-xs sm:text-sm font-medium mb-1">
                            {item.productId?.brand}
                          </p>
                          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
                            <span className="text-gray-400">
                              <span className="font-medium text-gray-300">
                                Color:
                              </span>{" "}
                              {item.selectedColor}
                            </span>
                            <span className="text-gray-400">
                              <span className="font-medium text-gray-300">
                                Qty:
                              </span>{" "}
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-white text-sm sm:text-base">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-5 sm:space-y-6">
                    {/* Summary */}
                    <div className="bg-gray-800/30 rounded-xl p-4 sm:p-5 border border-gray-700">
                      <h3 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                        <span>💰</span> Order Summary
                      </h3>
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-[13px] sm:text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white font-medium">
                            {formatPrice(selectedOrder.totalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[13px] sm:text-sm">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-green-400 font-medium">
                            Free
                          </span>
                        </div>
                        <div className="border-t border-gray-700 pt-2.5 flex justify-between font-bold text-base sm:text-lg">
                          <span className="text-white">Total</span>
                          <span className="text-gold">
                            {formatPrice(selectedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-800/30 rounded-xl p-4 sm:p-5 border border-gray-700">
                      <h4 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                        <span>📍</span> Delivery Address
                      </h4>
                      <div className="space-y-1.5 text-[13px] sm:text-sm">
                        <p className="text-gray-300">
                          {selectedOrder.deliveryAddress?.address ||
                            "Not provided"}
                        </p>
                        <p className="text-gray-300">
                          {selectedOrder.deliveryAddress?.city || "City"},{" "}
                          {selectedOrder.deliveryAddress?.province ||
                            "Province"}
                        </p>
                        <p className="text-gray-300">
                          {selectedOrder.deliveryAddress?.country || "Country"}
                        </p>
                        {selectedOrder.customer?.mobileNumber && (
                          <div className="pt-2 mt-2 border-t border-gray-700">
                            <p className="text-gold font-medium flex items-center gap-1.5">
                              <span>📱</span>
                              {selectedOrder.customer.mobileNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5 sm:space-y-6">
                    {/* Receipt */}
                    {selectedOrder.receipt && (
                      <div className="bg-gray-800/30 rounded-xl p-4 sm:p-5 border border-gray-700">
                        <h4 className="font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                          <span>🧾</span> Payment Receipt
                        </h4>
                        <a
                          href={`${API_URL}/${selectedOrder.receipt}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 sm:gap-2 text-gold hover:text-yellow-300 font-medium bg-gold/10 hover:bg-gold/20 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition-all border border-gold/30 hover:border-gold/50 w-full justify-center text-[13px] sm:text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Receipt
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-800">
                      <h4 className="font-bold text-base sm:text-lg mb-3 text-white">
                        Actions
                      </h4>

                      <div className="space-y-2.5">
                        {/* Cancel Order – destructive but subtle */}
                        {selectedOrder.status === "pending_payment" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelOrder(selectedOrder._id);
                              setSelectedOrder(null);
                            }}
                            className="w-full px-4 py-3 rounded-lg text-sm font-medium
                   bg-red-950/40 text-red-300
                   border border-red-900
                   hover:bg-red-900/60 hover:border-red-700
                   transition"
                          >
                            Cancel Order
                          </button>
                        )}

                        {/* Continue Shopping – primary CTA */}
                        <Link
                          to="/shop"
                          onClick={() => setSelectedOrder(null)}
                          className="block w-full px-4 py-3 rounded-lg text-sm font-semibold
                 bg-gold text-black
                 hover:bg-gold/90
                 transition text-center
                 shadow-md shadow-gold/20"
                        >
                          Continue Shopping
                        </Link>

                        {/* Contact Support – secondary gold outline */}
                        <Link
                          to="/contact"
                          onClick={() => setSelectedOrder(null)}
                          className="block w-full px-4 py-3 rounded-lg text-sm font-medium
                 border border-gold/60
                 text-gold
                 hover:bg-gold/10
                 transition text-center"
                        >
                          Contact Support
                        </Link>

                        {/* Close – neutral */}
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="w-full px-4 py-3 rounded-lg text-sm font-medium
                 bg-gray-800 text-gray-200
                 hover:bg-gray-700
                 transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomerOrders;
