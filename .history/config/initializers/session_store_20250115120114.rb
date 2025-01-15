Rails.application.config.session_store :cookie_store,
  key: '_your_app_session',
  secure: Rails.env.production?,
  httponly: true,
  expire_after: 180.minutes
  # expiration can be set to not expire, as rails stores session data in cookies, offloading server load issue
