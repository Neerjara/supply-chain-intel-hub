using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace SCIH.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, IHostEnvironment env)
    {
        _next = next;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var correlationId = context.Response.Headers["X-Correlation-ID"].FirstOrDefault() ?? context.TraceIdentifier;

            Log.Error(ex, "Unhandled exception encountered during request execution. Path: {Path}, Method: {Method}, CorrelationId: {CorrelationId}",
                context.Request.Path, context.Request.Method, correlationId);

            await HandleExceptionAsync(context, ex, correlationId, _env);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception, string correlationId, IHostEnvironment env)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var problemDetails = new ProblemDetails
        {
            Status = (int)HttpStatusCode.InternalServerError,
            Title = "An unexpected error occurred while processing your request.",
            Detail = env.IsDevelopment() ? exception.Message : "Please contact system administrator with the correlation ID.",
            Instance = context.Request.Path
        };

        problemDetails.Extensions["correlationId"] = correlationId;
        problemDetails.Extensions["timestamp"] = DateTime.UtcNow;

        if (env.IsDevelopment())
        {
            problemDetails.Extensions["stackTrace"] = exception.StackTrace;
        }

        var json = JsonSerializer.Serialize(problemDetails);
        return context.Response.WriteAsync(json);
    }
}
