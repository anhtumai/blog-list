# Blog list

> Backend for blog list project for course fullstack open 2021. Written in Express (TypeScript)

> Practice TDD on backend development

## Blogs

`/api/blogs` - **GET**

* View all records table (url, author, title, likes)

`/api/blogs/<string:blog_id>` - **GET**

* View single blog record by ID

`/api/blogs` - **POST**

* Add new blog record
* Params: `url`, `author`, `title`, `likes` (optional)

`/api/blogs/<string:blog_id>` - **DELETE**

* Delete blog record by ID

`/api/blogs/<string:blog_id>` - **PUT**

* Update blog record by ID
* Params: `url`, `author`, `title`, `likes` (optional)

## Users

`/api/users` - **GET**

* View all records table (username, name)

`/api/users` - **POST**

* Add new user record
* Params: `username`, `name`, `password` 

`/api/users/<string:user_id>` - **DELETE**

* Delete user record by ID

`/api/users/<string:user_id>` - **PUT**

* Update user record by ID
* Params: `username`, `name`, `password`

## TDD workflow

- Implement "basic" test cases for new feature. These tests should fail.
- Implement new feature.
- Fix both source code and test cases (test cases are code after all) along with testing.
- When tests pass, add new tests for edge cases.
- Refractor and test continuosly until all test cases pass 

