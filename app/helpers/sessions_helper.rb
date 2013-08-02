module SessionsHelper
    def sign_in(user)
        session[:user_id] = user.id
    end

    def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    def signed_in?
        !current_user.nil?
    end

    def authorize
        redirect_to root_url, alert: "Please sign in to access this feature" if current_user.nil?
    end

    def current_user?(user)
        user == current_user
    end
end
