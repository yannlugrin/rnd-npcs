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

#### categories (Array\<[CategoryData](global.html#CategoryData)\>)

Categories require a label (same as the recipe) and must contain one or more fields. Categories are mainly used to group fields visually and have no further impact on the logic by default.

#### fields (Array\<[FieldData](global.html#FieldData)\>)
Fields are the bread and butter, so to speak. They are the lines that get rolled, the single puzzle pieces that make up your end result. A field has to have a name and at least one formula. You can read more about Formulas on the [concepts page](./tutorial-concepts.html). Fields *can* have a label, but don't have to. If they don't have a label, they won't be rendered, and are therefor considered hidden. They can still store information, get updated in the propagation chain, and so on. If you look at the person example, you can see that there's a `full_name` field, made up of `first_name` and `last_name`. Changing fields may lead to other field's information becoming obsolete. With the person example, the `nick_name` formulas contain either the `first_name` or `last_name` or both. Meaning once one of those gets updated, the nick needs updating as well. This is where propagation comes into play. You can define an array of field names (identifiers), that need rerolling after a field has changed. You may also specify an order value, which determines in which order fields get rerolled. This is especially useful as in the first run, when the Creation gets first rolled, every field will need to be rolled. So if you have fields depending on each other, you should make sure to reflect that with order values, by giving fields that should be rolled later a higher order value.

#### actions (Array\<[ActionButtonData](global.html#ActionButtonData)\>)

#### Introducing your own Recipe
