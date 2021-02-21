package com.globits.PI.utils;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class EmailUtil {

	/**
	 * Utility method to send simple HTML email
	 * 
	 * @param session
	 * @param toEmail
	 * @param subject
	 * @param body
	 */
	public static boolean sendEmail(String host, String toEmail, String subject, String body) {
		try {
			System.out.println("SimpleEmail Start");
			// Đăng nhập = gmail bên dưới
			// truy cập: https://myaccount.google.com/lesssecureapps
			// Bật: Quyền truy cập của ứng dụng kém an toàn
			final String username = "globits.service@gmail.com"; // requires valid gmail id
			final String password = "ctet2009"; // correct password for gmail id

			System.out.println("TLSEmail Start");
			Properties prop = new Properties();
			prop.put("mail.smtp.host", "smtp.gmail.com");
			prop.put("mail.smtp.port", "465");
			prop.put("mail.smtp.auth", "true");
			prop.put("mail.smtp.socketFactory.port", "465");
			prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
			prop.put("mail.smtp.timeout", "10000");
			
			Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
				protected PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication(username, password);
				}
			});

			MimeMessage msg = new MimeMessage(session);
			// set message headers
			msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
			msg.addHeader("format", "flowed");
			msg.addHeader("Content-Transfer-Encoding", "8bit");

			msg.setFrom(new InternetAddress("no_reply@example.com", host));

			msg.setReplyTo(InternetAddress.parse("no_reply@example.com", false));

			msg.setSubject(subject, "UTF-8");

			// Body: HTML content.
			MimeBodyPart text = new MimeBodyPart();
			text.setContent(body, "text/html;charset=UTF-8");
			MimeMultipart mm = new MimeMultipart();
			mm.addBodyPart(text);

			msg.setContent(mm);

			msg.setSentDate(new Date());

			msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));
			
			System.out.println("Message is ready");
			Transport.send(msg);

			System.out.println("EMail Sent Successfully!!");
			return true;
		} catch (MessagingException | UnsupportedEncodingException e) {
			System.out.println("Send email to '" + toEmail + "' error");
			e.printStackTrace();
			System.out.println("Exception: " + e.getMessage());
			return false;
		}
	}
}
