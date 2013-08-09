class User < ActiveRecord::Base
    include PublicActivity::Common
    before_save{ self.email = email.downcase }
    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i  
    validates :name, presence: true
    has_secure_password 
    validates :email, presence: true, format: {with: VALID_EMAIL_REGEX}, uniqueness: {case_sensitive: false}
    has_many :decks, dependent: :destroy
end
