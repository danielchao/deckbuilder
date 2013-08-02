class DeckCard < ActiveRecord::Base
  belongs_to :deck, dependent: :destroy
  belongs_to :card, dependent: :destroy
end
