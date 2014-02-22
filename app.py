import tornado.ioloop
import tornado.web
from os import path
import os
import json

def save_json(filename, data):
    """Save data to a json file

    Parameters
    ----------
    filename : str
        Filename to save data in.
    data : dict
        Dictionary to save in json file.

    """

    fp = file(filename, 'w')
    json.dump(data, fp, sort_keys=True, indent=4)
    fp.close()
    

def load_json(filename):
    """Load data from a json file

    Parameters
    ----------
    filename : str
        Filename to load data from.

    Returns
    -------
    data : dict

    """

    fp = file(filename, 'r')
    data = json.load(fp)
    fp.close()
    return data


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        with open("index.html","r") as f:
            self.write(f.read())
        

class SaveHandler(tornado.web.RequestHandler):
    
    def get(self):
        self.redirect('/', permanent=False)
    
    def post(self):
        print "got to post!"
        filename = self.get_argument('title')
        print "will save %s"%filename
        info = self.get_argument('sidebars')
        info = tornado.escape.json_decode(info)
        
        print "will save %s"%filename
        
        save_json("static/%s.json"%filename.replace(" ","_"),
                  {"title":filename,"sidebars": info})
        
        return

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
    (r"/save_note",SaveHandler),
    (r"/js/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"js")}),
    (r"/css/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"css")}),
    (r"/img/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"img")}),
    (r"/fonts/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"fonts")}),
    (r"/templates/(.*)",tornado.web.StaticFileHandler, {"path": os.path.join(root,"templates")}),
],**settings)

if __name__ == "__main__":
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
