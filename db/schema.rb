# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_12_30_072840) do
  create_table "dlcs", force: :cascade do |t|
    t.integer "appid"
    t.string "name"
    t.string "image_url"
    t.string "developer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "search_name"
    t.index ["appid"], name: "index_dlcs_on_appid", unique: true
  end

  create_table "games", force: :cascade do |t|
    t.integer "appid"
    t.string "name"
    t.string "image_url"
    t.string "developer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "search_name"
    t.index ["appid"], name: "index_games_on_appid", unique: true
  end

  create_table "invalid_games", force: :cascade do |t|
    t.integer "appid"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "owned_games", force: :cascade do |t|
    t.string "name"
    t.string "developer"
    t.integer "appid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
    t.boolean "completed", default: false
    t.boolean "played", default: false
    t.integer "order", default: 0, null: false
  end

end
