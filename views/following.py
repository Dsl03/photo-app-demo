from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
import flask_jwt_extended


def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter_by(user_id=self.current_user.id)
        following_list = [user.to_dict_following() for user in following]

        return Response(json.dumps(following_list), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        print(body)

        following = Following.query.filter_by(user_id=self.current_user.id)
        following_list = [follow.to_dict_following().get("following").get("id") for follow in following]

        if body.get("user_id") in following_list:
            return Response(json.dumps({"message" : "already following"}), mimetype="application/json", status=400)

        if not body.get("user_id"):
            return Response(json.dumps({"message" : "invalid id"}), mimetype="application/json", status=400)

        if type(body.get("user_id")) == str:
            if not body.get("user_id").isdigit():
                return Response(json.dumps({"message" : "invalid type"}), mimetype="application/json", status=400)

        user = User.query.get(body.get("user_id"))
        if not user:
            return Response(json.dumps({"message" : "invalid user id"}), mimetype="application/json", status=404)


        new_following = Following(
            user_id = self.current_user.id,
            following_id = body.get("user_id")
        )

        db.session.add(new_following)    # issues the insert statement
        db.session.commit()
        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)
class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):

        following = Following.query.get(id)
        if not following:
            return Response(json.dumps({"message" : "invalid comment"}), mimetype="application/json", status=404)
        if following.user_id != self.current_user.id :
            return Response(json.dumps({"message" : "restricted access"}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({"message" : "Comment id={0} was deleted".format(id)}), mimetype="application/json", status=200)





def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )