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

ActiveRecord::Schema[7.1].define(version: 2025_01_13_112630) do
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

  create_table "owned_games", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "completed", default: false
    t.boolean "played", default: false
    t.integer "order", default: 0, null: false
    t.integer "user_id"
    t.integer "dlc_id"
    t.integer "game_id"
    t.index ["user_id"], name: "index_owned_games_on_user_id"
  end

  create_table "playlist_games", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "playlist_id"
    t.integer "owned_game_id"
    t.boolean "completed", default: false
    t.boolean "played", default: false
    t.integer "order"
    t.index ["owned_game_id"], name: "index_playlist_games_on_owned_game_id"
    t.index ["playlist_id"], name: "index_playlist_games_on_playlist_id"
  end

  create_table "playlists", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.integer "order"
    t.index ["user_id"], name: "index_playlists_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "steam_id"
    t.string "persona_name"
    t.string "profile_url"
    t.string "avatar_url"
    t.integer "last_logoff"
    t.integer "game_count"
  end

  add_foreign_key "owned_games", "dlcs"
  add_foreign_key "owned_games", "games"
  add_foreign_key "owned_games", "users"
  add_foreign_key "playlist_games", "owned_games"
  add_foreign_key "playlist_games", "playlists"
  add_foreign_key "playlists", "users"
end
