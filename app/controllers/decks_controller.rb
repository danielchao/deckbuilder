class DecksController < ApplicationController
    @card_regex = /^([0-9]+)\s+([^\s][0-9a-zA-Z,\-\' \/]*)$/

    def show
        @deck = Deck.find(params[:id])
    end

    def create
        @deck = current_user.decks.build(deck_params)
        if @deck.save
            if !@deck.private
                @deck.create_activity :create, owner: current_user
            end
            redirect_to edit_deck_path(@deck), notice: "Success!"
        else
            render 'new'
        end
    end
    
    def new
        @deck  = Deck.new
        @decks = current_user.decks
    end

    def edit
        if current_user?(User.find(Deck.find(params[:id]).user_id))
            @deck = Deck.find(params[:id])
            @decks = current_user.decks
        else
            redirect_to root_path, flash: { error: "Unauthorized edit"}
        end
    end

    def update
        @deck = Deck.find(params[:id])
        correct_user(@deck)
        if @deck.update_attributes(deck_params)
            if !@deck.private
                @deck.create_activity :update, owner: current_user
            end
            flash[:success] = "Deck updated"
            redirect_to edit_deck_path(@deck) 
        else
            render 'edit'
        end
    end

    def destroy
        @deck = Deck.find(params[:id])
        if !@deck.private
            @deck.create_activity :destroy, owner: current_user
        end
        correct_user(@deck) 
        @deck.destroy
        redirect_to user_path(current_user.id)
    end

    def show
        @deck = Deck.find(params[:id])
        respond_to do |format|
            format.js { render action: "_show.js"}
            format.html
        end
    end

    private
        def deck_params
            params.require(:deck).permit(:name, :description, :content, :num_cards, :private)
        end

        def correct_user(deck)
            redirect_to(root_url) unless current_user?(deck.user)
        end
end
