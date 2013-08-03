class CardsController < ApplicationController

    def query
        #regex = /src="(.*.jpg)"/
        regex=/src="(.*.jpg)" \n.*alt="(.*)"\swidth.*"/
        name = params[:card][:name]
        name.gsub!(' ', '+')

        imgs = get_images(name).scan(regex)
        respond_to do |format|
            format.json {render json: imgs.to_json }
        end
    end

    private 
        def get_images(query)
            require 'open-uri'
            content = ""
            open("http://magiccards.info/query?q=#{query}") do |f|
                f.each_line {|line| content << line}
            end
            return content
        end
end
