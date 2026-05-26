<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Soldier's Thirst — Weekly Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
        h1 { color: #0B2D4E; margin-bottom: 4px; }
        .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-size: 13px; }
        th { background: #0B2D4E; color: #fff; }
        .summary { display: flex; gap: 16px; margin-bottom: 24px; }
        .card { flex: 1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; }
        .card strong { display: block; font-size: 22px; color: #0B2D4E; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <h1>Soldier's Thirst — Weekly Sales Report</h1>
    <p class="meta">Period: {{ $dateFrom }} to {{ $dateTo }} · Generated {{ now()->format('M d, Y h:i A') }}</p>

    <div class="summary">
        <div class="card">
            <span>Total Revenue</span>
            <strong>₱{{ number_format($totalRevenue, 2) }}</strong>
        </div>
        <div class="card">
            <span>Total Orders</span>
            <strong>{{ $totalOrders }}</strong>
        </div>
    </div>

    <h2>Daily Revenue</h2>
    <table>
        <thead><tr><th>Date</th><th>Orders</th><th>Revenue (₱)</th></tr></thead>
        <tbody>
            @forelse($orders as $row)
            <tr>
                <td>{{ $row->date }}</td>
                <td>{{ $row->order_count }}</td>
                <td>{{ number_format($row->revenue, 2) }}</td>
            </tr>
            @empty
            <tr><td colspan="3">No sales recorded for this period.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>Order Type Breakdown</h2>
    <table>
        <thead><tr><th>Type</th><th>Orders</th><th>Revenue (₱)</th></tr></thead>
        <tbody>
            @foreach($breakdown as $row)
            <tr>
                <td>{{ ucfirst($row->order_type) }}</td>
                <td>{{ $row->count }}</td>
                <td>{{ number_format($row->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Payment Method Breakdown</h2>
    <table>
        <thead><tr><th>Method</th><th>Orders</th><th>Revenue (₱)</th></tr></thead>
        <tbody>
            @foreach($paymentBreakdown as $row)
            <tr>
                <td>{{ strtoupper($row->payment_method) }}</td>
                <td>{{ $row->count }}</td>
                <td>{{ number_format($row->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p style="font-size:12px;color:#94a3b8;margin-top:32px;">
        Open this file in a browser and use Print → Save as PDF to export.
    </p>
</body>
</html>
