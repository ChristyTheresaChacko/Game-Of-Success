from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")


@app.route('/page1', methods=['GET', 'POST'])
def page1():
    return render_template("page1.html")


if __name__ == '__main__':

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    