from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post
import json
from views import get_authorized_user_ids
import flask_jwt_extended


class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id)
        bookmarks_list = [bookmark.to_dict() for bookmark in bookmarks]

        return Response(json.dumps(bookmarks_list), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()



        if not body.get("post_id"):
            return Response(json.dumps({"message" : "invalid postid"}), mimetype="application/json", status=400)

        if type(body.get("post_id")) == str:
            if not body.get("post_id").isdigit():
                return Response(json.dumps({"message" : "invalid type"}), mimetype="application/json", status=400)

        post = Post.query.get(body.get("post_id"))
        if not post:
            return Response(json.dumps({"message" : "invalid post"}), mimetype="application/json", status=404)

        auid = get_authorized_user_ids(self.current_user)

        if post.user_id not in auid:
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id)
        bookmarks_list = [bookmark.to_dict().get("post").get("id") for bookmark in bookmarks]

        if body.get("post_id") in bookmarks_list:
            return Response(json.dumps({"message" : "already bookmarked"}), mimetype="application/json", status=400)

        new_bm = Bookmark(
            user_id=self.current_user.id,
            post_id=body.get("post_id")
        )
        
        
        db.session.add(new_bm)    # issues the insert statement
        db.session.commit()
        return Response(json.dumps(new_bm.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):


        bookmark = Bookmark.query.get(id)
        if not bookmark:
            return Response(json.dumps({"message" : "invalid post"}), mimetype="application/json", status=404)
        
        if bookmark.user_id != self.current_user.id :
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({"message" : "Post id={0} was deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )