class UsersController < ApplicationController
    before_action :authorize, only: [:show, :edit]
    before_action :correct_user, only: [:update, :edit]
    def create
        @user = User.new(user_params)
        if @user.save
            sign_in @user
            redirect_to root_url, notice: "Success!"
        else
            render 'static_pages/home'
        end
    end

    def edit
        @user = User.find(params[:id])
    end

    def update
        if !@user.authenticate(params[:user][:password])
            flash[:error] = "Wrong password"
            redirect_to edit_user_path(@user)        
        elsif @user.update_attributes(user_update_params)
            flash[:success] = "Profile updated"
            sign_in @user
            redirect_to @user
        else
            render 'edit'
        end
    end

    def destroy
    end

    def show
        @user = User.find(params[:id])
        @decks = @user.decks
        @deck = Deck.new
    end

    def index
        @users = User.all
    end

    private
        def user_params
            params.require(:user).permit(:name, :email, :password, :password_confirmation)
        end
        
        def user_update_params
            params.require(:user).permit(:name, :email)
        end

        def correct_user
            @user = User.find(params[:id])
            redirect_to(root_url) unless current_user?(@user)
        end
end
