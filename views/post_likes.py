from pdb import post_mortem
from flask import Response, request
from flask_restful import Resource
from models import LikePost, db, Post
from views import get_authorized_user_ids
import json
import flask_jwt_extended


class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()


        plikes = LikePost.query.filter_by(user_id=self.current_user.id)
        plike_list = [plike.to_dict().get("post_id") for plike in plikes]
        if body.get("post_id") in plike_list:
            return Response(json.dumps({"message" : "already liked"}), mimetype="application/json", status=400)

        if type(body.get("post_id")) == str:
            if not body.get("post_id").isdigit():
                return Response(json.dumps({"message" : "invalid type"}), mimetype="application/json", status=400)
        
        post = Post.query.get(body.get("post_id"))
        if not post:
            return Response(json.dumps({"message" : "invalid post id"}), mimetype="application/json", status=404)
        
        auid = get_authorized_user_ids(self.current_user)

        if post.user_id not in auid:
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        new_likepost = LikePost(
            post_id = body.get("post_id"),
            user_id = self.current_user.id
        )
        db.session.add(new_likepost)    # issues the insert statement
        db.session.commit()
        return Response(json.dumps(new_likepost.to_dict()), mimetype="application/json", status=201)


class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        like_post = LikePost.query.get(id)
        if not like_post:
            return Response(json.dumps({"message" : "invalid comment"}), mimetype="application/json", status=404)
        if like_post.user_id != self.current_user.id :
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({"message" : "like id={0} was deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
