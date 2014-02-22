import tornado.ioloop
import tornado.web
from os import path
import os

class MainHandler(tornado.web.RequestHandler):

    def get(self):
        with open("index.html","r") as f:
            self.write(f.read())
        

root = path.abspath('.')

settings = {
        "static_path": path.join(root, "static"),
        "template_path": root,
        "globals": {
            "project_name": "mangonote"
        },
        "flash_policy_port": 843,
        "flash_policy_file": path.join(root, 'flashpolicy.xml'),
        
    }

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/js/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"js")}),
    (r"/css/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"css")}),
    (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"img")}),
    (r"/fonts/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"fonts")}),
    (r"/templates/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"templates")}),
],**settings)

if __name__ == "__main__":
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
