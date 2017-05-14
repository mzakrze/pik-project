package com.project.pik.EbayApi;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.ebay.sdk.ApiContext;
import com.ebay.sdk.ApiCredential;
import com.ebay.services.client.ClientConfig;
import com.ebay.soap.eBLBaseComponents.SiteCodeType;
import com.project.pik.EbayApi.service.EbayService;
import com.project.pik.EbayApi.service.EbayServiceImpl;

@Configuration
public class ApplicationConfig {
	private static final Logger logger = Logger.getLogger(ApplicationConfig.class);
	private static final String PROPERTIES_FILE_NAME = "/ebay.properties";
	
	@Bean EbayService getEbayService() {
		return new EbayServiceImpl();
	}
	
	@Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return (container -> {
            container.setPort(8090);
        });
    }
	
	@Bean @Lazy
	public ApiContext eBaySoapApi(){
		// TODO SEARCHNIG_CURRENCY not autowired, etc
		final SiteCodeType SITE_CODING = SiteCodeType.US;
		final String SEARCHING_CURRENCY = "EUR";
		
		Properties keys = new Properties();
		try {
			InputStream in = EbayServiceImpl.class.getResourceAsStream(PROPERTIES_FILE_NAME);
			keys.load(in);
		} catch (IOException e) {
			logger.error("Could not load ebay properties file");
			logger.error(e.getMessage());
		}
		/** Set ApiAccount and token in ApiCredential */
		ApiCredential credential = new ApiCredential();
		credential.seteBayToken(keys.getProperty("token"));

		ApiContext context = new ApiContext();
		context.setApiCredential(credential);
		context.setApiServerUrl("https://api.ebay.com/wsapi"); // production

		return context;
	}
	
	@Bean
	public ClientConfig eBayClientConfig(){
		Properties keys = new Properties();
		try {
			InputStream in = EbayServiceImpl.class.getResourceAsStream(PROPERTIES_FILE_NAME);
			keys.load(in);
		} catch (IOException e) {
			logger.error("Could not load ebay properties file");
			logger.error(e.getMessage());
		}
		/** Set ClientConfig for finding API */
		ClientConfig config = new ClientConfig();
		config.setApplicationId(keys.getProperty("appId"));

		return config;
	}
}