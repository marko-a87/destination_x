from app import app, db, login_manager
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify, session
from sqlalchemy.inspection import inspect


def object_as_dict(obj):
    #print("object_as_dict: ", {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs})
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}
