class CardsController < ApplicationController

    def query
        #Structure of url: /mi/en/207.html
        #Structure of pic: /scans/en/mi/207.jpg
        regex = /<td><a href="(.*)">(.*)<.*<.*\n.*<td>(.*)<.*\n.*<td>(.*)</
        # regex for non-land
        single_page_regex = /<a\shref="(.*)">(.*)<\/a>(?:\n.*){7}<p>(.*),.*\n\s+(.*)\s+/
        # regex for land
        single_page_regex2 = /a\shref="(.*)">(.*)<\/a>(?:\n.*){7}<p>(.*)()/

        name = params[:card][:name]
        name.gsub!(' ', '+')
        if Rails.cache.read(name)
            imgs = Rails.cache.read(name)
        else
            if params[:card][:unique]
                curl = get_images(name, true)
            else
                curl = get_images(name, false)
            end

            imgs = curl.scan(regex)
            if imgs.count == 0 
                imgs = curl.scan(single_page_regex)
            end
            if imgs.count == 0 
                imgs = curl.scan(single_page_regex2)
            end
            regex = /\/(.*)\/(.*)\/(.*).html/

            (0...imgs.count).each do |i|
                match = regex.match(imgs[i][0])
                if match[2] != 'en'
                    imgs[i] = nil
                else
                    imgs[i][0] = "http://magiccards.info/scans/#{match[2]}/#{match[1]}/#{match[3]}.jpg"
                    imgs[i].push "http://magiccards.info/#{match[1]}/#{match[2]}/#{match[3]}.html"
                end
            end
            imgs.compact!
            Rails.cache.write(name, imgs)
        end
        respond_to do |format|
            format.json {render json: imgs.to_json }
        end
    end

    private 
        def get_images(query, unique)
            require 'open-uri'
            content = ""
            if unique
                open("http://magiccards.info/query?q=!#{query}") do |f|
                    f.each_line {|line| content << line}
                end
            else
                open("http://magiccards.info/query?q=#{query}&v=olist") do |f|
                    f.each_line {|line| content << line}
                end
            end
            return content
        end
end
