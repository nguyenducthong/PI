package com.globits.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class KeycloakCorsFilter implements Filter {

	@SuppressWarnings("unused")
	private Boolean isInWhileList(String clientUrl, String allowedOrigins) {
		return allowedOrigins.contains(clientUrl);
	}

	@Autowired
	private Environment env;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		String allowedHeaders = env.getProperty("endpoints.cors.allowed-headers");
		String allowedMethods = env.getProperty("endpoints.cors.allowed-methods");
		String allowedOrigins = env.getProperty("endpoints.cors.allowed-origins");
		String allowedCredentials = env.getProperty("endpoints.cors.allow-credentials");
		String maxAge = env.getProperty("endpoints.cors.max-age");

		final HttpServletResponse response = (HttpServletResponse) res;

		response.setHeader("Access-Control-Allow-Methods", allowedMethods);
		response.setHeader("Access-Control-Allow-Headers", allowedHeaders);
		response.setHeader("Access-Control-Allow-Credentials", allowedCredentials);
		response.setHeader("Access-Control-Max-Age", maxAge);
		response.setHeader("Access-Control-Allow-Origin", allowedOrigins);

		if ("OPTIONS".equalsIgnoreCase(((HttpServletRequest) req).getMethod())) {
			response.setStatus(HttpServletResponse.SC_OK);
		} else {
			chain.doFilter(req, res);
		}
	}

	@Override
	public void destroy() {
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
	}
}