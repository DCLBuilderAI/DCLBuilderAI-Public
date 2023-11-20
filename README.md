# DCLBuilderAI-Public

<img width="1434" alt="Screen Shot 2023-11-20 at 8 28 52 PM" src="https://github.com/DCLBuilderAI/DCLBuilderAI-Public/assets/56746236/858ba445-e5fe-454c-86bd-4a3b3b161058">


## Introduction

DCLBuilderAI is an AI-powered build tool for creating SDK7 compatible custom scripts for Decentraland and using them for generating scenes for lands. It can be used for generate SDK7 compatible code, 3d models, and images using text prompts. The idea is that we'll use SDK7 data for training and creating an open-sourced fine-tuned model to support scene/code generation. Our versions of the datasets will be accessible on Kaggle as well: https://www.kaggle.com/datasets/dclbuilderai/decentraland-sdk7-training-data - this will be updated as we make more and more progress.

We've made code-generation videos available at: https://www.youtube.com/@dclbuilderai-my2td 

We're currently in private beta, join the waitlist here: https://dclbuilderai.com/

## Datasets 

- All the different versions of our training data sets will be accessible at: https://www.kaggle.com/datasets/dclbuilderai/decentraland-sdk7-training-data. While some of the data may require formatting, we will make it readable and will stick to the original 9-month 50k goal.
- Our goal is to create the largest fine-tuned model trained on Decentraland, while we will try to make it so such that is produces SDK7 Compatable code, we cannot guarantee that the output will be strictly for ECS7. However, that doesn't mean that the code will not work for the SDK. 

## What do the different Generate buttons do?

We're using three different models for training the AI, in order to best assess which one has the best performance output, we're exposing endpoints to all three of them in the beta. 
- Generate (A): is using a davinci trained model for predicting results. 
- Generate (B): is using a curie trained model for code generation.
- Generate (C): is using an ada trained model for the code generation.
- Generate Model: is generating a 3D .gltf model that can be used in Decentraland builds. 

To read more on the relevance of these models, refer to OpenAI's fine-tuning guide, https://platform.openai.com/docs/guides/fine-tuning

