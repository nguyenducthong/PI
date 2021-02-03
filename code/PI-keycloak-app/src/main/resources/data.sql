INSERT IGNORE INTO oauth_client_details(client_id, resource_ids, client_secret, scope, authorized_grant_types, web_server_redirect_uri, authorities, access_token_validity, refresh_token_validity, additional_information, autoapprove)
VALUES('sample_client', NULL, '$2a$10$ePZ9kwbN2JyipmgJeCT4RudBZJ5Cwt6HeI1KzdHwJt37.WUFAE.a2', 'read,write,delete', 'password,authorization_code,refresh_token', NULL, NULL, 36000, 36000, NULL, 1);
	
