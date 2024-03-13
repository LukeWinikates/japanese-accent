// Package metrics adapted from: https://github.com/jensteichert/webvitals_exporter
package metrics

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

type Vital = *prometheus.SummaryVec

type WebVitals struct {
	TTFB *prometheus.SummaryVec
	FCP  *prometheus.SummaryVec
	LCP  *prometheus.SummaryVec
	FID  *prometheus.SummaryVec
	CLS  *prometheus.SummaryVec
}

var labelNames = []string{"app"}

var Vitals = WebVitals{
	TTFB: createVital("web_vitals_time_to_first_byte_ms", "Time To First Byte"),
	FCP:  createVital("web_vitals_first_contentful_paint_ms", "First Contentful Paint"),
	LCP:  createVital("web_vitals_largest_contentful_paint_latency_ms", "Largest Contentful Paint"),
	FID:  createVital("web_vitals_first_input_delay_ms", "First Input Delay"),
	CLS:  createVital("web_vitals_cumulative_layout_shift", "Cumulative Layout Shift"),
}

func createVital(name string, help string) *prometheus.SummaryVec {
	vital := prometheus.NewSummaryVec(
		prometheus.SummaryOpts{
			Name: name,
			Help: help,
		},
		labelNames,
	)

	prometheus.MustRegister(vital)
	return vital
}

type WebVitalPayload struct {
	ID        string  `json:"id"`
	Label     string  `json:"label"`
	Name      string  `json:"name"`
	StartTime float64 `json:"startTime"`
	Value     float64 `json:"value"`
}

func HandleWebVital(context *gin.Context) {
	var payload WebVitalPayload
	if err := context.BindJSON(&payload); err != nil {
		context.Status(500)
		return
	}

	var vital Vital

	switch name := payload.Name; name {
	case "TTFB":
		vital = Vitals.TTFB
	case "FCP":
		vital = Vitals.FCP
	case "LCP":
		vital = Vitals.LCP
	case "FID":
		vital = Vitals.FID
	case "CLS":
		vital = Vitals.CLS
	}

	if vital != nil {
		vital.WithLabelValues("Japanese Accent").Observe(payload.Value)
	}

	context.String(200, "ok")
}
