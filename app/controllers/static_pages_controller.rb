class StaticPagesController < ApplicationController
    def home
        @user = User.new
        if signed_in?
            @activities = PublicActivity::Activity.order("created_at desc").limit(25)
            render "activities/index"
        end
    end

    def about
    end
end
