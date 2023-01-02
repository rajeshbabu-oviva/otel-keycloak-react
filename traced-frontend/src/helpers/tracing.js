import { context, trace, SpanStatusCode } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
// import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const serviceName = "sample-frontend";

const resource = new Resource({ "service.name": serviceName });
const provider = new WebTracerProvider({ resource });

provider.register({ contextManager: new ZoneContextManager() });

const webTracerWithZone = provider.getTracer(serviceName);

var bindingSpan;

window.startBindingSpan = (traceId, spanId, traceFlags) => {
  bindingSpan = webTracerWithZone.startSpan("");
  bindingSpan.spanContext().traceId = traceId;
  bindingSpan.spanContext().spanId = spanId;
  bindingSpan.spanContext().traceFlags = traceFlags;
};

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: ["/.*/g"],
      clearTimingResources: true,
      applyCustomAttributesOnSpan: (span, request, result) => {
        console.log("called during span send ", request);
        const attributes = span.attributes;
        if (attributes.component === "fetch") {
          span.updateName(
            `${attributes["http.method"]} ${attributes["http.url"]}`
          );
        }
        if (result instanceof Error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: result.message,
          });
          span.recordException(result.stack || result.name);
        }
      },
    }),
  ],
});

export function traceSpan(name, func) {
  var singleSpan;
  if (bindingSpan) {
    const ctx = trace.setSpan(context.active(), bindingSpan);
    singleSpan = webTracerWithZone.startSpan(name, undefined, ctx);
    bindingSpan = undefined;
  } else {
    singleSpan = webTracerWithZone.startSpan(name);
  }

  const collectorOptions = {
    url: "http://localhost:4318/v1/traces",
    headers: { authorization: window.accessToken },
  };

  const exporter = new OTLPTraceExporter(collectorOptions);

  provider.addSpanProcessor(
    new BatchSpanProcessor(exporter, {
      // The maximum queue size. After the size is reached spans are dropped.
      maxQueueSize: 100,
      // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
      maxExportBatchSize: 10,
      // The interval between two consecutive exports
      scheduledDelayMillis: 500,
      // How long the export can run before it is cancelled
      exportTimeoutMillis: 30000,
    })
  );

  return context.with(trace.setSpan(context.active(), singleSpan), () => {
    try {
      const result = func();
      singleSpan.end();
      return result;
    } catch (error) {
      singleSpan.setStatus({ code: SpanStatusCode.ERROR });
      singleSpan.end();
      throw error;
    }
  });
}
