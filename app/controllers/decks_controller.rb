class DecksController < ApplicationController
    @card_regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)$/

    def show
        @deck = Deck.find(params[:id])
    end

    def create
        @deck = current_user.decks.build(deck_params)
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
    
    def new
        @deck  = Deck.new
    end

    def update
        @deck = Deck.find(params[:id])
        correct_user(@deck)
        if @deck.update_attributes(deck_params)
            flash[:success] = "Deck updated"
            redirect_to deck_path(@deck) 
        else
            render 'edit'
        end
    end

    def destroy
        @deck = Deck.find(params[:id])
        correct_user(@deck) 
        @deck.destroy
        redirect_to user_path(current_user.id)
    end

    def show
        @deck = Deck.find(params[:id])
    end

    private
        def deck_params
            params.require(:deck).permit(:name, :description, :content)
        end

        def correct_user(deck)
            redirect_to(root_url) unless current_user?(deck.user)
        end
end
