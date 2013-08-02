class Deck < ActiveRecord::Base
  belongs_to :user
  validates :name, presence: true
  has_many :deck_cards
  has_many :cards, through: :deck_cards
end
