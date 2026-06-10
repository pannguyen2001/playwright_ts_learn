# generator.py

import json
import uuid

import polars as pl


def create_user():
    user = {"username": "admin_example", "password": "123456"}

    # insert into DB
    ...

    return user


if __name__ == "__main__":
    print(json.dumps(create_user()))
