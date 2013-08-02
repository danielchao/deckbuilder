class AddContentToDecks < ActiveRecord::Migration
  def change
    add_column :decks, :content, :text
  end
end
