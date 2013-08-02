class DecksController < ApplicationController
    before_action :correct_user, only: [:destroy, :create]

    def show
        @deck = Deck.find(params[:id])
    end

    def create
        card_regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)$/
        @deck = current_user.decks.build(deck_params)
        cards = []
        @cards = params[:cards][:names].each_line do |line| 
            cards.push(line.strip) if !line.strip.blank?
        end
        cards.each do |card|
            if m = card_regex.match(card)
                (1..m[1].to_i).each do |n|
                    c = Card.find_or_create_by(name: m[2])
                    @deck.cards.push(c)
                end
            end
        end
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
        cards = @deck.cards
        @deck.destroy
        cards.each do |card|
            card.destroy if card.decks.count == 0
        end
        redirect_to user_path(current_user.id)
    end

    def show
        @deck = Deck.find(params[:id])
        @cards = @deck.cards.group('name')
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
