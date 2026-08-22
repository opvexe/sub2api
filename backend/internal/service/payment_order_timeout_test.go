package service

import (
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/payment"
)

func TestOrderTimeoutMinutesFloorsOnChainProviders(t *testing.T) {
	cases := []struct {
		name        string
		configured  int
		providerKey string
		paymentType string
		want        int
	}{
		{"cashier keeps the configured timeout", 30, payment.TypeAlipay, payment.TypeAlipay, 30},
		{"cashier falls back to the default", 0, payment.TypeWxpay, payment.TypeWxpay, defaultOrderTimeoutMin},
		{"on-chain is floored", 30, payment.TypeNowPayments, payment.TypeNowPayments, onChainOrderTimeoutMinFloor},
		{"on-chain default is floored", 0, payment.TypeNowPayments, payment.TypeNowPayments, onChainOrderTimeoutMinFloor},
		{"on-chain honors a longer config", 720, payment.TypeNowPayments, payment.TypeNowPayments, 720},
		{"on-chain detected via payment type alone", 30, "", payment.TypeNowPayments, onChainOrderTimeoutMinFloor},
		{"on-chain second instance is floored", 30, "nowpayments_2", "nowpayments_2", onChainOrderTimeoutMinFloor},
		{"a provider merely prefixed differently is not on-chain", 30, "nowpaymentsx", "nowpaymentsx", 30},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			cfg := &PaymentConfig{OrderTimeoutMin: tc.configured}
			if got := orderTimeoutMinutes(cfg, tc.providerKey, tc.paymentType); got != tc.want {
				t.Errorf("orderTimeoutMinutes(%d, %q, %q) = %d, want %d",
					tc.configured, tc.providerKey, tc.paymentType, got, tc.want)
			}
		})
	}
}
