# Optional avatar model

The current portfolio uses a procedural Three.js avatar shaped from the supplied personal photo reference (hair, skin tone, suit, shirt, tie and facial-hair styling). No fabricated GLB is included.

If you later generate a higher-fidelity personal character, place it here as:

`public/models/avatar.glb`

and replace `AvatarCanvas` in `src/main.jsx` with a GLTF loader for the model.
