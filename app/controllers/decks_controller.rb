class DecksController < ApplicationController
    before_action :correct_user, only: [:destroy, :create]
    def show
        @deck = Deck.find(params[:id])
    end

    def create
        @deck = current_user.decks.build(deck_params)
        cards = []
        @cards = params[:cards][:names].each_line do |line| 
            cards.push(line.strip) if !line.strip.blank?
        end
        #cards.each do |card|
            #@deck.cards.create(name: card)
        #end
        #render text: cards
        
        if @deck.save
            redirect_to user_path(current_user.id), notice: "Success!"
        else
            flash[:error] = ""
            @deck.errors.full_messages.each do |e| 
                flash[:error] << e 
            end
            redirect_to user_path(current_user.id)
        end
    end

    def destroy
        @deck = Deck.find(params[:id])
        @deck.destroy
        redirect_to user_path(current_user.id)
    end

    def show
        @deck = Deck.find(params[:id])
    end

    private
        def deck_params
            params.require(:deck).permit(:name, :description)
        end

        def correct_user
            @user = User.find(params[:user_id])
            redirect_to(user_path(@user)) unless current_user?(@user)
        end
end
