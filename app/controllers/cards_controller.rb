class CardsController < ApplicationController

    def query
        #Structure of url: /mi/en/207.html
        #Structure of pic: /scans/en/mi/207.jpg
        regex = /<td><a href="(.*)">(.*)<.*<.*\n.*<td>(.*)<.*\n.*<td>(.*)</

        name = params[:card][:name]
        name.gsub!(' ', '+')
        imgs = get_images(name).scan(regex)
        regex = /\/(.*)\/(.*)\/(.*).html/

        (0...imgs.count).each do |i|
            match = regex.match(imgs[i][0])
            if match[2] != 'en'
                imgs[i] = nil
            else
                imgs[i][0] = "http://magiccards.info/scans/#{match[2]}/#{match[1]}/#{match[3]}.jpg"
            end
        end
        imgs.compact!
        respond_to do |format|
            format.json {render json: imgs.to_json }
        end
    end

    private 
        def get_images(query)
            require 'open-uri'
            content = ""
            open("http://magiccards.info/query?q=#{query}&v=olist") do |f|
                f.each_line {|line| content << line}
            end
            return content
        end
end
