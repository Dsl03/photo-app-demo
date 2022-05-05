from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import get_authorized_user_ids

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()

        if type(body.get("post_id")) == str:
            if not body.get("post_id").isdigit():
                return Response(json.dumps({"message" : "invalid type"}), mimetype="application/json", status=400)

        post = Post.query.get(body.get("post_id"))
        if not post:
            return Response(json.dumps({"message" : "invalid post"}), mimetype="application/json", status=404)

        auid = get_authorized_user_ids(self.current_user)

        if post.user_id not in auid:
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        if not body.get("text"):
            return Response(json.dumps({"message" : "invalid text"}), mimetype="application/json", status=400)


        newcomment = Comment (
            user_id = self.current_user.id,
            post_id = body.get("post_id"),
            text = body.get("text")
        )

        db.session.add(newcomment)    # issues the insert statement
        db.session.commit()
        return Response(json.dumps(newcomment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        comment = Comment.query.get(id)
        if not comment:
            return Response(json.dumps({"message" : "invalid comment"}), mimetype="application/json", status=404)
        if comment.user_id != self.current_user.id :
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({"message" : "Comment id={0} was deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
