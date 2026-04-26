package com.pawmart.backend.admin.dto;

public record StatsResponse(
    long totalMembers,
    long totalProducts,
    long totalOrders,
    long todayOrders,
    long totalRevenue
) {}
