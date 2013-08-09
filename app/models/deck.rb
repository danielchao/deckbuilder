class Deck < ActiveRecord::Base
    include PublicActivity::Common
    #tracked owner: ->(controller, model) { controller && controller.current_user}
    belongs_to :user
    validates :name, presence: true
end
