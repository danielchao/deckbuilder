class AddPrivateToDecks < ActiveRecord::Migration
  def change
    add_column :decks, :private, :boolean
  end
end
