// Note: Replace *<YOUR_APPLICATION_TOKEN>* with your actual Application token
class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }
    async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue,inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

async function main(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
    const flowIdOrName = 'beea0b4e-b3b1-4d15-9c30-3d51dedcdc21';
    const langflowId = '9f68d467-5037-4a47-808a-cb67ed197aea';
    const applicationToken = 'AstraCS:GlhwsfCyyYBINrefJoygpzOP:189b047362a4a9cec6b89cf5209c68504893961597824995c49a1d8479f014e4';
    const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com',
        applicationToken);

    try {
      const tweaks = {
  "ChatInput-I5LaI": {
    "files": "",
    "background_color": "",
    "chat_icon": "",
    "sender": "User",
    "sender_name": "User",
    "session_id": "",
    "should_store_message": true,
    "text_color": ""
  },
  "AstraDB-RBSa5": {
    "advanced_search_filter": "{}",
    "api_endpoint": "https://70cf08c4-6c1b-4bf8-811f-1860a85611f6-us-east-2.apps.astra.datastax.com",
    "batch_size": null,
    "bulk_delete_concurrency": null,
    "bulk_insert_batch_concurrency": null,
    "bulk_insert_overwrite_concurrency": null,
    "collection_indexing_policy": "",
    "collection_name": "mock_data",
    "embedding_choice": "Embedding Model",
    "keyspace": "",
    "metadata_indexing_exclude": "",
    "metadata_indexing_include": "",
    "metric": "cosine",
    "number_of_results": 4,
    "pre_delete_collection": false,
    "search_filter": {},
    "search_input": "",
    "search_score_threshold": 0,
    "search_type": "Similarity",
    "setup_mode": "Sync",
    "token": "ASTRA_DB_APPLICATION_TOKEN"
  },
  "ParseData-iZZlk": {
    "sep": "\n",
    "template": "{text}"
  },
  "Prompt-CpdIR": {
    "template": "You are an intelligent assistant that answers questions based on two inputs: \n1. The chat history (to maintain conversation context), and \n2. An external dataset (to provide accurate and detailed answers).\n\nHere is the chat history so far:\n{chat_history}\n\nHere is the relevant external data:\n{data}\n\nThe user has asked the following question:\n{user_question}\n\nYour task is to:\n- Provide an accurate and relevant answer using the external data when applicable.\n- Maintain the context of the conversation",
    "data": "",
    "chat_history": "",
    "user_question": ""
  },
  "GoogleGenerativeAIModel-9n1G0": {
    "google_api_key":'AIzaSyAGPxZbKpwX2yV_Dc66fWqE6bPn9cijh1c',
    "input_value": "",
    "max_output_tokens": null,
    "model": "gemini-1.5-flash-8b",
    "n": null,
    "stream": false,
    "system_message": "",
    "temperature": 0.52,
    "top_k": null,
    "top_p": null
  },
  "ChatOutput-vt3QH": {
    "background_color": "",
    "chat_icon": "",
    "data_template": "{text}",
    "input_value": "",
    "sender": "Machine",
    "sender_name": "AI",
    "session_id": "",
    "should_store_message": true,
    "text_color": ""
  },
  "Google Generative AI Embeddings-zOpQW": {
    "api_key": "AIzaSyAGPxZbKpwX2yV_Dc66fWqE6bPn9cijh1c",
    "model_name": "models/text-embedding-004"
  },
  "File-CPcxX": {
    "path": "instagram_user_data_100.csv",
    "concurrency_multithreading": 4,
    "silent_errors": false,
    "use_multithreading": false
  },
  "SplitText-1JgxW": {
    "chunk_overlap": 10,
    "chunk_size": 100,
    "separator": "\n"
  },
  "AstraDB-WvLjy": {
    "advanced_search_filter": "{}",
    "api_endpoint": "https://70cf08c4-6c1b-4bf8-811f-1860a85611f6-us-east-2.apps.astra.datastax.com",
    "batch_size": null,
    "bulk_delete_concurrency": null,
    "bulk_insert_batch_concurrency": null,
    "bulk_insert_overwrite_concurrency": null,
    "collection_indexing_policy": "",
    "collection_name": "mock_data",
    "embedding_choice": "Embedding Model",
    "keyspace": "",
    "metadata_indexing_exclude": "",
    "metadata_indexing_include": "",
    "metric": "cosine",
    "number_of_results": 4,
    "pre_delete_collection": false,
    "search_filter": {},
    "search_input": "",
    "search_score_threshold": 0,
    "search_type": "Similarity",
    "setup_mode": "Sync",
    "token": "ASTRA_DB_APPLICATION_TOKEN"
  },
  "Google Generative AI Embeddings-2BYAL": {
    "api_key": "AIzaSyAGPxZbKpwX2yV_Dc66fWqE6bPn9cijh1c",
    "model_name": "models/text-embedding-004"
  },
  "Memory-VEAB9": {
    "n_messages": 10,
    "order": "Ascending",
    "sender": "Machine and User",
    "sender_name": "",
    "session_id": "",
    "template": "{sender_name}: {text}"
  },
  "IDGenerator-Jp1Wc": {
    "unique_id": "e41288ea-48d9-497f-85ed-19446eca68c1"
  }
};
      const response = await langflowClient.runFlow(
          flowIdOrName,
          langflowId,
          inputValue,
          inputType,
          outputType,
          tweaks,
          stream,
          (data) => console.log("Received:", data.chunk), // onUpdate
          (message) => console.log("Stream Closed:", message), // onClose
          (error) => console.log("Stream Error:", error) // onError
      );
      if (!stream && response && response.outputs) {
          const flowOutputs = response.outputs[0];
          const firstComponentOutputs = flowOutputs.outputs[0];
          const output = firstComponentOutputs.outputs.message;
          console.log("Final Output:", output.message.text);
      }
    } catch (error) {
      console.error('Main Error', error.message);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Please run the file with the message as an argument: node <YOUR_FILE_NAME>.js "user_message"');
}
main(
  args[0], // inputValue
  args[1], // inputType
  args[2], // outputType
  args[3] === 'true' // stream
);
