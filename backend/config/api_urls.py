from django.urls import path
from .usage_stats import UsageStatsView

urlpatterns = [
    path('', UsageStatsView.as_view(), name='admin-usage-stats'),
]
