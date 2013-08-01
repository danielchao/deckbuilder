module SessionsHelper
    def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    def signed_in?
        !current_user.nil?
    end

    def authorize
        redirect_to root_url, alert: "Please sign in to access this feature" if current_user.nil?
    end
end
