class SessionsController < ApplicationController
  def destroy
    reset_session
    redirect_to add_games_path, notice: "Logged out successfully"
  end
end
