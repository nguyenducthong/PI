package com.globits.config;

import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Starting from Spring Boot Keycloak Adapter 7.0.0, we are required to
 * explicitly define a KeycloakSpringBootConfigResolver bean to make Spring Boot
 * resolve the Keycloak configuration from application.properties (or
 * application.yml) correctly. It must be defined in a @Configuration class.
 *
 * This class is normally not necessary. As of {@code KEYCLOAK-11282}, declaring
 * the {@link KeycloakSpringBootConfigResolver} directly in your
 * {@link Configuration} class that extends from
 * {@link KeycloakWebSecurityConfigurerAdapter} will cause the Spring Boot
 * application context not to load.
 *
 * Additional note: As of Keycloak starter version 8.0.0 using this helper there
 * is also no need to override
 * {@code spring.main.allow-bean-definition-overriding} property to
 * {@code true}.
 * 
 * https://issues.redhat.com/browse/KEYCLOAK-11282
 */

//@ComponentScan(
//        basePackageClasses = KeycloakSecurityComponents.class,
//        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.keycloak.adapters.springsecurity.management.HttpSessionManager")
//        )
//@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true,jsr250Enabled = true)
@Configuration
public class KeycloakConfig {

	@Bean
	public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
		return new KeycloakSpringBootConfigResolver();
	}

}
