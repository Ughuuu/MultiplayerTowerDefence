using UnityEngine;
using System.Collections;
using System;
using Colyseus;
using MsgPack;
using UnityEngine.UI;

public class ClientListener : MonoBehaviour {

	Client colyseus;
	Room chatRoom;

    class Message
    {
        public string message;

        public Message(string message)
        {
            this.message = message;
        }
    }

    public void SendText()
    {
        InputField uiField = GameObject.Find("InputField").GetComponent<InputField>();
        Message msg = new Message(uiField.text);
        Debug.Log(JsonUtility.ToJson(msg));
        chatRoom.Send(JsonUtility.ToJson(msg));
    }

	IEnumerator Start () {
        if (Debug.isDebugBuild)
        {
            colyseus = new Client("ws://localhost:3333");
        }
        else
        {
            colyseus = new Client("ws://localhost:3333");
            //colyseus = new Client("ws://multiplayertd.herokuapp.com");
        }
		colyseus.OnOpen += OnOpenHandler;
		yield return StartCoroutine(colyseus.Connect());

		chatRoom = colyseus.Join("chat");
        chatRoom.OnJoin += OnRoomJoined;
        chatRoom.state.Listen ("messages/:number", "add", OnPlayerMessage);
        chatRoom.OnUpdate += OnUpdate;

        while (true)
        {
            colyseus.Recv();

            if (colyseus.error != null)
			{
				Debug.LogError ("Error: "+colyseus.error);
				break;
			}

			yield return 0;
		}
	}

    void AddMessage(string message)
    {
        GameObject.Find("TextBoard").GetComponent<Text>().text += message + '\n';
    }

	void OnOpenHandler (object sender, EventArgs e)
	{
		Debug.Log("Connected to server. Client id: " + colyseus.id);
	}

	void OnRoomJoined (object sender, EventArgs e)
	{
		Debug.Log("Joined room successfully.");
	}

	void OnPlayerMessage (string[] path, MessagePackObject value)
	{
		Debug.Log ("OnPlayerMove");
		Debug.Log (path[0]);
		Debug.Log (value);
        AddMessage(path[0] + value);
	}

    void OnUpdate(object sender, RoomUpdateEventArgs e)
    {
        var list = e.state.AsDictionary()["messages"].AsList();
        if (list.Count == 0)
            return;
        AddMessage(list[list.Count - 1].AsString());
    }

    void OnApplicationQuit()
	{
		colyseus.Close();
	}

    ~ClientListener()
    {
        colyseus.Close();
    }

}
