Rails.application.config.session_store :cookie_store,
  key: '_your_app_session',
  secure: Rails.env.production?,
  httponly: true,
  expire_after: 30.minutes
