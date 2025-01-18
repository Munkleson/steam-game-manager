class ApplicationController < ActionController::Base
  before_action  :check_session, :profile_dropdown



  private

  def check_session
    @user_id = session[:user_id]
    @user = User.find_by(id: @user_id)
    if !@user
      if request.path != "/" && !request.path.include?("/steam")
        redirect_to root_path, alert: "Your session has expired. Please log in again"
      end
    end
  end

  def profile_dropdown
    if @user
      @profile_dropdown_options = [
        {
          text: "Steam profile",
          link: @user.profile_url
        },
      ]
    end
  end
end
