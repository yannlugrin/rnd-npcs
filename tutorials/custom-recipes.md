#### Writing a custom recipe
Recipes are just json files. In order to make your life easier, you can reference the provided json-schema file (src/static/data/recipes-schema.json). Start by adding a json file to your module.
```json
{
  "$schema": "path/to/recipes-schema.json",
  "recipes":
  [
  ]
}
```
If you did include the schema, your editor of choice should now hopefully give you a whole bunch of fields that need to be filled out. Let's go over them, one by one:

#### recipes (Array\<[RecipeData](global.html#RecipeData)\>)

This is just an array with all your custom recipes. Pretty self explanatory. Each recipe needs a name, a label, an icon, and at least one category. The name field serves as an identifier, the label is a key that can be loaded via `game.i18n.localization(YOUR_KEY_HERE)` in code or `{{localize YOUR_KEY_HERE}}` in a handlebars template. Icon refers to a Font Awesome icon id, like `fas fa-arrow-left`.

#### categories (Array\<Object\>)

Categories require a label (same as the recipe) and must contain one or more fields. Categories are mainly used to group fields visually and have no further impact on the logic by default.

#### fields (Array\<[FieldData](global.html#FieldData)\>)
