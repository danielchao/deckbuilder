class AddNumCardsToDecks < ActiveRecord::Migration
  def change
    add_column :decks, :num_cards, :integer
  end
end
